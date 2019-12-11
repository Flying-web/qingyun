
let responseBeautifier = new class {
    constructor() {
        this.response = {
            status: "",
            data: {},
            message: ""
        },
            this.StatusCode = new Map();
        this.registeStatusCode("ok", "OK");
        this.registeStatusCode("error", "ERROR");
    }
    registeStatusCode(status, description) {
        this.StatusCode.set(status, description);
    }
    registeStatusCodes(arr) {
        for (let [status, description] of arr) {
            this.StatusCode.set(status, description);
        }
    }
    set(status = 'ok', data, message, regs) {
        return {
            status,
            data,
            message: message || this.StatusCode.get(status),
            currentAuthority: data.currentAuthority || 'guest',
            ...regs
        }
    }
    success(data, message, regs) {
        const status = "ok"
        return {
            status,
            data,
            message: message || this.StatusCode.get(status),
            currentAuthority: data.authority || 'guest',
            ...regs
        }
    }
    error(message, regs) {
        const status = "error"
        return {
            status,
            data: {},
            message: message || this.StatusCode.get(status),
            currentAuthority: 'guest',
            type: "account",
            ...regs
        }
    }
}();

//registe Status Code 

responseBeautifier.registeStatusCodes([
    ["500", "Server internal error"],
    ["404", "NtFound"],
    ["302", "redirect"],
    ["200", "success"],
])


module.exports = responseBeautifier;