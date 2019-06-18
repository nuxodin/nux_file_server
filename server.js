import { extname } from "https://deno.land/x/fs/path.ts";
import { contentType } from "https://deno.land/x/media_types/mod.ts";

class server {
    constructor(options={}){
        this.options = options;
    }
    async listen(req){
        const fileName = req.url.replace(/\/$/, '');
        var found = await serve(request, this.options.base + fileName);
        if (!found) return false;
        response = await serveFile(req, filePath);
        req.respond(response);
        return true;
    }
    serve(request, file){
        const file = await open(filename);
        const fileInfo = await stat(filename);
        const headers = new Headers();
        headers.set("content-length", fileInfo.len.toString());
        headers.set("content-type", contentType(extname(filename)) || 'text/plain');
        const res = {
            status: 200,
            body: file,
            headers
        };
        return res;        
    }
}
export server;
