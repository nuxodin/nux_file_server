import { stat } from '../nux/util/nuxo.js';
import { pathToContentType } from './util.js';

export class FileServer {
    constructor(documentRoot, basePath = '/'){
        this.documentRoot = documentRoot;
        this.basePath = basePath;
    }
    async serve(ctx){
        const pathName = ctx.in.url.pathname;
        if (!pathName.startsWith(this.basePath)) return;
        const urlPart = pathName.substr(this.basePath.length);
        var found = await fileToResponse(this.documentRoot + '/' + urlPart, ctx.out);
        if (!found) return;
        return true;
    }
}
async function fileToResponse(path, response){
    path = path.replace(/^file:\/\//,'');
    let fileInfo = await stat(path);
    if (!fileInfo || !fileInfo.isFile) return;
    response.headers.set('content-length', fileInfo.size);
    response.headers.set('content-type', pathToContentType(path) || 'text/plain');
    response.body = await Deno.open(path);
    return true;
}
