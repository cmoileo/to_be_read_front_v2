import { HttpInterceptor } from "./http-interceptor.service";
export class MobileToReadListService {
    static async getToReadList(page = 1) {
        return HttpInterceptor.get(`/to-read-list/${page}`);
    }
    static async addToReadList(googleBookId) {
        return HttpInterceptor.post("/to-read-list", { googleBookId });
    }
    static async removeFromReadList(googleBookId) {
        return HttpInterceptor.delete("/to-read-list", { googleBookId });
    }
}
