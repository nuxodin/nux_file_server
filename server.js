import { extname } from "https://deno.land/x/fs/path.ts";
import { contentType } from "https://deno.land/x/media_types/mod.ts";

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
        const file = await Deno.open(path);
        const fileInfo = await Deno.stat(path);
        if (!fileInfo.isFile()) return false;
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
