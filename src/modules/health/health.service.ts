class HealthService {
    getHealth() {
        return {
            status : "OK"
        };
    }
}

export default new HealthService();