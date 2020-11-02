export class ValidatorError extends Error {
    private _message: string;
    private _props: string[];
    propName?: string;
    constructor(m: string, propName?: string | string[]) {
        super();
        Object.setPrototypeOf(this, ValidatorError.prototype);
        this._message = m;
        this._props = [];
        if (propName) {
            if (Array.isArray(propName)) {
                this._props = propName;
            } else {
                this._props.push(propName);
            }
        }
        this.name = ValidatorError.name;
    }
    get message() {
        return `${this._message}: ${this._props.join(".")}`;
    }

    addPropToTheStart(propName: string) {
        this._props.unshift(propName);
    }
    addPropToTheEnd(propName: string) {
        this._props.push(propName);
    }
}
