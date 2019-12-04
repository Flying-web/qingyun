
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
    set(data, message) {
        const status = "ok"
        if (this.StatusCode.has(status)) {
            return {
                status,
                data,
                message: message || this.StatusCode.get(status),
                currentAuthority: data.currentAuthority || 'guest',
            }
        } else {
            // log Something ,here is an unique status
            return {
                status,
                data,
                message: message || "Unresolvable Status Code :" + status,
            }
        }
    }
    success(data, message, regs) {
        const status = "ok"
        if (this.StatusCode.has(status)) {
            console.log({
                status,
                data,
                message: message || this.StatusCode.get(status),
                currentAuthority: data.authority || 'guest',
                ...regs
            })
            return {
                status,
                data,
                message: message || this.StatusCode.get(status),
                currentAuthority: data.authority || 'guest',
                ...regs
            }
        } else {
            // log Something ,here is an unique status
            return {
                status,
                data,
                message: message || "Unresolvable Status Code :" + status,
                ...regs
            }
        }
    }
    error(message,regs) {
        const status = "error"
        if (this.StatusCode.has(status)) {
            return {
                status,
                data: {},
                message: message || this.StatusCode.get(status),
                currentAuthority: 'guest',
                type:"account",
                ...regs
            }
        } else {
            // log Something ,here is an unique status
            return {
                status,
                data: {},
                message: message || "Unresolvable Status Code :" + status,
                ...regs
            }
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