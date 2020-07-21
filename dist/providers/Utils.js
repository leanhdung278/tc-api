"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PermissionConfig_1 = require("../configs/PermissionConfig");
class Util {
    //Convert string to slug
    static slugify(str) {
        let slug = undefined;
        slug = str.toLowerCase();
        slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
        slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
        slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
        slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
        slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
        slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
        slug = slug.replace(/đ/gi, 'd');
        slug = slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '');
        slug = slug.replace(/ /gi, "-");
        slug = slug.replace(/\-\-\-\-\-/gi, '-');
        slug = slug.replace(/\-\-\-\-/gi, '-');
        slug = slug.replace(/\-\-\-/gi, '-');
        slug = slug.replace(/\-\-/gi, '-');
        slug = '@' + slug + '@';
        slug = slug.replace(/\@\-|\-\@|\@/gi, '');
        return slug;
    }
    //Fromat ms
    static ms(val, options) {
        let s = 1000;
        let m = s * 60;
        let h = m * 60;
        let d = h * 24;
        let w = d * 7;
        let y = d * 365.25;
        let parse = (str) => {
            str = String(str);
            if (str.length > 100)
                return;
            let match = /^(-?(?:\d+)?\.?\d+) *(ms|s|m|h|d|w|y)?$/i.exec(str);
            if (!match)
                return;
            let n = parseFloat(match[1]);
            let type = (match[2] || 'ms').toLowerCase();
            switch (type) {
                case 'y':
                    return n * y;
                case 'w':
                    return n * w;
                case 'd':
                    return n * d;
                case 'h':
                    return n * h;
                case 'm':
                    return n * m;
                case 's':
                    return n * s;
                case 'ms':
                    return n;
                default:
                    return undefined;
            }
        };
        let fmtLong = (ms) => {
            let msAbs = Math.abs(ms);
            if (msAbs >= d)
                return plural(ms, msAbs, d, 'ngày');
            if (msAbs >= h)
                return plural(ms, msAbs, h, 'giờ');
            if (msAbs >= m)
                return plural(ms, msAbs, m, 'phút');
            if (msAbs >= s)
                return plural(ms, msAbs, s, 'giây');
            return ms + ' ms';
        };
        let fmtShort = (ms) => {
            let msAbs = Math.abs(ms);
            if (msAbs >= d)
                return Math.round(ms / d) + 'd';
            if (msAbs >= h)
                return Math.round(ms / h) + 'h';
            if (msAbs >= m)
                return Math.round(ms / m) + 'm';
            if (msAbs >= s)
                return Math.round(ms / s) + 's';
            return ms + 'ms';
        };
        let plural = (ms, msAbs, n, name) => {
            let isPlural = msAbs >= n * 1.5;
            return Math.round(ms / n) + ' ' + name;
        };
        let type = typeof val;
        if (type === 'string')
            return parse(val);
        else if (type === 'number')
            return options && options.long ? fmtLong(val) : fmtShort(val);
    }
}
exports.default = Util;
Util.getPermission = (name, path) => {
    let permission = PermissionConfig_1.PERMISSION.find(item => item.path == path && item.name == name);
    return permission;
};
//# sourceMappingURL=Utils.js.map