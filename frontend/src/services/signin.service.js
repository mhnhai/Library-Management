import createApiClient from './api.service';
class SignInService {
    constructor(baseUrl = '/api/signin') {
        this.api = createApiClient(baseUrl);
    }

    async get(id) {
        return (await this.api.get(`/${id}`)).data;
    }
    async update(id, data) {
        return (await this.api.put(`/${id}`, data)).data;
    }

    async getAll() {
        return (await this.api.get('/')).data;
    }

    async create(data) {
        // Object contactlocal
        // console.log(await this.api.post('/', data));
        return (await this.api.post('/', data)).data;
    }
}
export default new SignInService();
