import { Document, DocumentQuery } from "mongoose";
import { QueryOption } from "./request.tool";
import { isNullOrUndefined } from "util";
import { Readable } from "stream";

export class ObjectTool {
    static filterObject(object: any, restrictFields: string[]): any {
        const restrictLength = restrictFields.length;
        for (let i = 0; i < restrictLength; i++) {
            delete object[restrictFields[i]];
        }
        return object;
    }

    static applyQueryOption<T extends Document>(p: DocumentQuery<T[], T, {}>, options: QueryOption): DocumentQuery<T[], T, {}> {
        return p
            .sort(options.sort)
            .skip(options.skip)
            .limit(options.limit);
    }

    static parse<T>(stringObject: any): T {
        try {
            if (stringObject === "undefined") {
                return undefined;
            }
            return stringObject && JSON.parse(stringObject);
        } catch (err) {
            console.error("ObjectTool parse error:", err.message, stringObject);
            return stringObject as T;
        }
    }

    static isNullOrUndefined(obj: any) {
        return obj === undefined || obj === null;
    }

    static traverseAndFlatten(
        currentNode: { [field: string]: any },
        target: { [field: string]: any },
        depth: number = 1,
        flattenedKey?: string,
    ) {
        for (const key in currentNode) {
            if (currentNode.hasOwnProperty(key)) {
                let i = depth;
                let newKey;
                if (isNullOrUndefined(flattenedKey)) {
                    newKey = key;
                } else {
                    newKey = flattenedKey + "." + key;
                }

                const value = currentNode[key];
                if (typeof value === "object" && i > 0) {
                    i--;
                    this.traverseAndFlatten(value, target, i, newKey);
                } else {
                    target[newKey] = value;
                }
            }
        }
    }

    static flatten(obj: object, depth: number) {
        const flattenedObject = {};
        this.traverseAndFlatten(obj, flattenedObject, depth);
        return flattenedObject;
    }

    static bufferToReadable(buffer: Buffer): Readable {
        const stream = new Readable();
        stream.push(buffer);
        stream.push(null);
        return stream;
    }
}
