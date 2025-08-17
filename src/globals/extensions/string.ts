declare global {
    interface String {
        toCapitalize(): string;
    }
}

String.prototype.toCapitalize = function(): string {
    const str = String(this);
    if(str.length === 0) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export {};