import { stat } from '../nux/util/nuxo.js';
import { pathToContentType } from './util.js';

export class FileServer {
    constructor(documentRoot, basePath = '/'){
        this.documentRoot = documentRoot;
        this.basePath = basePath;
    }
    async serve(req){
        const pathName = req.URL.pathname;
        if (!pathName.startsWith(this.basePath)) return;
        const urlPart = pathName.substr(this.basePath.length);
        var found = await fileToResponse(this.documentRoot + '/' + urlPart, req.response);
        if (!found) return;
        return true;
    }
}
async function fileToResponse(path, response){
    path = path.replace(/^file:\/\//,'');
    let fileInfo = await stat(path);
    if (!fileInfo || !fileInfo.isFile) return;
    response.header['content-length'] = fileInfo.size;
    response.header['content-type'] = pathToContentType(path) || 'text/plain';
    response.body = await Deno.open(path);
    return true;
}
