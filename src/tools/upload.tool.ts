import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import multer = require("multer");
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import * as archiver from "archiver";
import * as bluebird from "bluebird";
import * as fs from "fs";
import { Document, model, Schema } from "mongoose";
import * as path from "path";
import * as sharp from "sharp";
import { parse } from "url";
import { StringTool } from "./string.tool";

export const SERVER_ADDRESS = "localhost";
export enum EUploadFolder {
    IMAGE = "images",
    DOCUMENT = "documents",
    DATA = "data",
    LANG_CERTIFICATE = "data/language-certificate",
}

export const UPLOAD_PATH_MODEL = "UploadPath";

export const UploadPathSchema = new Schema(
    {
        folder: {
            type: String,
            enum: Object.values(EUploadFolder),
        },
        url: String,
        path: String,
    },
    { timestamps: true, collection: "UploadPath" },
);

export class UploadPath {
    folder: string;
    url: string;
    filePath: string;
}

export interface UploadPathDocument extends UploadPath, Document {}
export class UploadTool {
    static removeFile(url: string) {
        throw new Error("Method not implemented.");
    }
    private static readonly uploadPathModel = model<UploadPathDocument>(UPLOAD_PATH_MODEL, UploadPathSchema);

    private static createUploadPath(folder: EUploadFolder, url: string, filePath: string): Promise<UploadPathDocument> {
        return this.uploadPathModel.create({ folder, url, path: filePath });
    }

    private static isImageFile(fileMimetype: string) {
        return ["image/img", "image/jpeg", "image/png", "image/gif", "image/svg+xml"].includes(fileMimetype);
    }

    static getURL(directory: EUploadFolder, filename: string) {
        return `${SERVER_ADDRESS}/${directory}/${filename}`;
    }

    static getURLMultiDir(directory: string, filename: string) {
        return `${SERVER_ADDRESS}/${directory}/${filename}`;
    }

    static getPath(fileUrl: string) {
        return `./uploads${decodeURIComponent(parse(fileUrl).pathname)}`;
    }

    static removeFileURL(fileURL: string) {
        if (fileURL) {
            const filePath = this.getPath(fileURL);
            fs.unlink(filePath, (err1: Error) => {
                if (err1) {
                    console.error(err1);
                } else {
                    this.uploadPathModel
                        .findOneAndDelete({ url: fileURL })
                        .exec()
                        .then(() => {
                            console.log(`Deleted ${fileURL}`);
                        })
                        .catch(err2 => {
                            console.error(`Error delete ${fileURL}: ${err2.message}`);
                        });
                }
            });
        }
    }

    static imageCompress = async (file: any, quality: number): Promise<any> => {
        await sharp(file.path)
            .toFormat("jpeg")
            .jpeg({
                quality,
            })
            .toBuffer()
            .then(data => {
                return fs.writeFileSync(file.path, data);
            });
    };

    static imageUpload: MulterOptions = {
        storage: multer.diskStorage({
            destination: `./uploads/${EUploadFolder.IMAGE}`,
            filename: async (req: Express.Request, file: Express.Multer.File, cb) => {
                const safeName = StringTool.normalizeFileName(file.originalname);
                const filename = `${file.fieldname}-${Date.now()}-${safeName}`;
                if (!UploadTool.isImageFile(file.mimetype)) {
                    return cb(new HttpException("Chi duoc upload anh", HttpStatus.FORBIDDEN), filename);
                }
                const url = UploadTool.getURL(EUploadFolder.IMAGE, filename);
                const filePath = UploadTool.getPath(url);
                await UploadTool.createUploadPath(EUploadFolder.IMAGE, url, filePath);
                cb(null, filename);
            },
        }),
    };

    static documentUpload: MulterOptions = {
        storage: multer.diskStorage({
            destination: `./uploads/${EUploadFolder.DOCUMENT}`,
            filename: async (req: Express.Request, file: Express.Multer.File, cb) => {
                const match = [
                    "application/pdf",
                    "image/img",
                    "image/jpeg",
                    "image/png",
                    "image/gif",
                    "application/pdf",
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    "application/msword",
                    "application/vnd.ms-powerpoint",
                    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                ];
                const safeName = StringTool.normalizeFileName(file.originalname);
                const filename = `${file.fieldname}-${Date.now()}-${safeName}`;
                if (!match.includes(file.mimetype)) {
                    return cb(new HttpException("Khong dung dinh danh file", HttpStatus.FORBIDDEN), filename);
                }
                const url = UploadTool.getURL(EUploadFolder.DOCUMENT, filename);
                const filePath = UploadTool.getPath(url);
                await UploadTool.createUploadPath(EUploadFolder.DOCUMENT, url, filePath);
                cb(null, filename);
            },
        }),
    };

    static dataUpload: MulterOptions = {
        storage: multer.diskStorage({
            destination: `./uploads/${EUploadFolder.DATA}`,
            filename: async (req: Express.Request, file: Express.Multer.File, cb) => {
                const safeName = StringTool.normalizeFileName(file.originalname);
                const filename = `${file.fieldname}-${Date.now()}-${safeName}`;
                const url = UploadTool.getURL(EUploadFolder.DATA, filename);
                const filePath = UploadTool.getPath(url);
                await UploadTool.createUploadPath(EUploadFolder.DATA, url, filePath);
                cb(null, filename);
            },
        }),
    };

    static excelUpload: MulterOptions = {
        storage: multer.diskStorage({
            destination: `./uploads/${EUploadFolder.DATA}`,
            filename: async (req: Express.Request, file: Express.Multer.File, cb) => {
                const match = ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"];
                const safeName = StringTool.normalizeFileName(file.originalname);
                const filename = `${file.fieldname}-${Date.now()}-${safeName}`;
                if (!match.includes(file.mimetype)) {
                    return cb(new HttpException("Chi upload file excel", HttpStatus.FORBIDDEN), filename);
                }
                const url = UploadTool.getURL(EUploadFolder.DATA, filename);
                const filePath = UploadTool.getPath(url);
                await UploadTool.createUploadPath(EUploadFolder.DATA, url, filePath);
                cb(null, filename);
            },
        }),
    };

    static langCertificateUpload: MulterOptions = {
        storage: multer.diskStorage({
            destination: `./uploads/${EUploadFolder.LANG_CERTIFICATE}`,
            filename: async (req: Express.Request, file: Express.Multer.File, cb) => {
                const safeName = StringTool.normalizeFileName(file.originalname);
                const filename = `${file.fieldname}-${Date.now()}-${safeName}`;
                const url = UploadTool.getURL(EUploadFolder.LANG_CERTIFICATE, filename);
                const filePath = UploadTool.getPath(url);
                await UploadTool.createUploadPath(EUploadFolder.LANG_CERTIFICATE, url, filePath);
                cb(null, filename);
            },
        }),
    };

    static memoryUpload: MulterOptions = {
        storage: multer.memoryStorage(),
    };

    static async createZipArchive(
        archiveName: string,
        relativeFilePaths: string[],
    ): Promise<{
        absolutePath: string;
        url: string;
    }> {
        const archiveZipName = `${archiveName}.zip`;
        const archivePath = path.join(__dirname, `../../uploads/${EUploadFolder.DATA}/${archiveZipName}`);
        const archiveURL = UploadTool.getURL(EUploadFolder.DATA, archiveZipName);
        const archive = archiver("zip", {
            zlib: { level: 9 },
        });
        const output = fs.createWriteStream(archivePath);
        archive.pipe(output);
        const p = new Promise<{
            absolutePath: string;
            url: string;
        }>(async (resolve1, reject1) => {
            // Handle output events
            output.on("close", () => {
                console.log(archive.pointer(), "total bytes");
                resolve1({
                    absolutePath: archivePath,
                    url: archiveURL,
                });
            });
            // Handle archive events
            archive.on("error", err => {
                reject1(err);
            });
            await bluebird.Promise.map(relativeFilePaths, async filePath => {
                const filename = path.basename(filePath);
                const stream = fs.createReadStream(filePath);
                archive.append(stream, { name: filename });
                return new Promise<void>((resolve2, reject2) => {
                    stream.on("error", err => {
                        reject2(err);
                    });
                    stream.on("close", () => {
                        resolve2();
                    });
                });
            }).catch(err => {
                reject1(err);
            });
            archive.finalize();
        }).catch(err => {
            UploadTool.removeFileURL(UploadTool.getURL(EUploadFolder.DATA, path.basename(archivePath)));
            throw err;
        });
        return p;
    }
}
