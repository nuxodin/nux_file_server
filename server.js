import { extname } from "https://deno.land/std@v0.41.0/path/mod.ts";

export class server {
    constructor(options={}){
        this.options = options;
    }
    async listen(req){
        const fileName = req.url.replace(/\/$/, '').replace(/\?.*/, '');
        var resp = await this.fileToResponse(this.options.base + fileName);
        if (!resp) return false;
        req.respond(resp);
        return true;
    }
    async fileToResponse(path){
        path = path.replace(/^file:\/\//,'');
        let fileInfo = null;
        try {
            fileInfo = await Deno.stat(path);
        } catch (e) { // not found
            return false;
        }
        if (!fileInfo.isFile()) return false;
        const file = await Deno.open(path);
        const headers = new Headers();
        headers.set("content-length", fileInfo.len.toString());
        headers.set("content-type", contentType(extname(path)) || 'text/plain');
        const res = {
            status: 200,
            body: file,
            headers
        };
        return res;
    }
}


const MEDIA_TYPES = {
    ".md": "text/markdown",
    ".html": "text/html",
    ".htm": "text/html",
    ".json": "application/json",
    ".map": "application/json",
    ".txt": "text/plain",
    ".ts": "text/typescript",
    ".tsx": "text/tsx",
    ".js": "application/javascript",
    ".jsx": "text/jsx",
    ".gz": "application/gzip",
};
function contentType(path) {
    return MEDIA_TYPES[extname(path)];
}