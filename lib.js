const fs = require('fs')
const path = require('path')
const BufferSerializer = require('buffer-serializer')

const unixCodes = {
    EPERM: -1,
    ENOENT: -2,
    ESRCH: -3,
    EINTR: -4,
    EIO: -5,
    ENXIO: -6,
    E2BIG: -7,
    ENOEXEC: -8,
    EBADF: -9,
    ECHILD: -10,
    EAGAIN: -11,
    ENOMEM: -12,
    EACCES: -13,
    EFAULT: -14,
    ENOTBLK: -15,
    EBUSY: -16,
    EEXIST: -17,
    EXDEV: -18,
    ENODEV: -19,
    ENOTDIR: -20,
    EISDIR: -21,
    EINVAL: -22,
    ENFILE: -23,
    EMFILE: -24,
    ENOTTY: -25,
    ETXTBSY: -26,
    EFBIG: -27,
    ENOSPC: -28,
    ESPIPE: -29,
    EROFS: -30,
    EMLINK: -31,
    EPIPE: -32,
    EDOM: -33,
    ERANGE: -34,
    EDEADLK: -35,
    ENAMETOOLONG: -36,
    ENOLCK: -37,
    ENOSYS: -38,
    ENOTEMPTY: -39,
    ELOOP: -40,
    EWOULDBLOCK: -11,
    ENOMSG: -42,
    EIDRM: -43,
    ECHRNG: -44,
    EL2NSYNC: -45,
    EL3HLT: -46,
    EL3RST: -47,
    ELNRNG: -48,
    EUNATCH: -49,
    ENOCSI: -50,
    EL2HLT: -51,
    EBADE: -52,
    EBADR: -53,
    EXFULL: -54,
    ENOANO: -55,
    EBADRQC: -56,
    EBADSLT: -57,
    EDEADLOCK: -35,
    EBFONT: -59,
    ENOSTR: -60,
    ENODATA: -61,
    ETIME: -62,
    ENOSR: -63,
    ENONET: -64,
    ENOPKG: -65,
    EREMOTE: -66,
    ENOLINK: -67,
    EADV: -68,
    ESRMNT: -69,
    ECOMM: -70,
    EPROTO: -71,
    EMULTIHOP: -72,
    EDOTDOT: -73,
    EBADMSG: -74,
    EOVERFLOW: -75,
    ENOTUNIQ: -76,
    EBADFD: -77,
    EREMCHG: -78,
    ELIBACC: -79,
    ELIBBAD: -80,
    ELIBSCN: -81,
    ELIBMAX: -82,
    ELIBEXEC: -83,
    EILSEQ: -84,
    ERESTART: -85,
    ESTRPIPE: -86,
    EUSERS: -87,
    ENOTSOCK: -88,
    EDESTADDRREQ: -89,
    EMSGSIZE: -90,
    EPROTOTYPE: -91,
    ENOPROTOOPT: -92,
    EPROTONOSUPPORT: -93,
    ESOCKTNOSUPPORT: -94,
    EOPNOTSUPP: -95,
    EPFNOSUPPORT: -96,
    EAFNOSUPPORT: -97,
    EADDRINUSE: -98,
    EADDRNOTAVAIL: -99,
    ENETDOWN: -100,
    ENETUNREACH: -101,
    ENETRESET: -102,
    ECONNABORTED: -103,
    ECONNRESET: -104,
    ENOBUFS: -105,
    EISCONN: -106,
    ENOTCONN: -107,
    ESHUTDOWN: -108,
    ETOOMANYREFS: -109,
    ETIMEDOUT: -110,
    ECONNREFUSED: -111,
    EHOSTDOWN: -112,
    EHOSTUNREACH: -113,
    EALREADY: -114,
    EINPROGRESS: -115,
    ESTALE: -116,
    EUCLEAN: -117,
    ENOTNAM: -118,
    ENAVAIL: -119,
    EISNAM: -120,
    EREMOTEIO: -121,
    EDQUOT: -122,
    ENOMEDIUM: -123,
    EMEDIUMTYPE: -124
}

const NO = [unixCodes.ENOENT]
const OK = [0]
const uid = process.getuid ? process.getuid() : 0
const gid = process.getgid ? process.getgid() : 0
const stdDate = new Date()
const dirAttributes = {
    mtime: stdDate,
    atime: stdDate,
    ctime: stdDate,
    nlink: 1,
    size: 100,
    mode: 16877,
    uid: uid,
    gid: gid
}


var serializer = new BufferSerializer()

var exports = module.exports = {}

const operations = {
    init:        (cb)                                               => undefined,
    access:      (path, mode, cb)                                   => undefined,
    statfs:      (path, cb)                                         => undefined,
    getattr:     (path, cb)                                         => undefined,
    fgetattr:    (path, fd, cb)                                     => undefined,
    flush:       (path, fd, cb)                                     => undefined,
    fsync:       (path, fd, datasync, cb)                           => undefined,
    readdir:     (path, cb)                                         => undefined,
    truncate:    (path, size, cb)                                   => undefined,
    ftruncate:   (path, fd, size, cb)                               => undefined,
    readlink:    (path, cb)                                         => undefined,
    chown:       (path, uid, gid, cb)                               => undefined,
    chmod:       (path, mode, cb)                                   => undefined,
    mknod:       (path, mode, dev, cb)                              => undefined,
    setxattr:    (path, name, buffer, length, offset, flags, cb)    => undefined,
    getxattr:    (path, name, buffer, length, offset, cb)           => undefined,
    listxattr:   (path, buffer, length, cb)                         => undefined,
    removexattr: (path, name, cb)                                   => undefined,
    open:        (path, flags, cb)                                  => undefined,
    opendir:     (path, flags, cb)                                  => undefined,
    read:        (path, fd, buffer, length, offset, cb)             => undefined,
    write:       (path, fd, buffer, length, offset, cb)             => undefined,
    release:     (path, fd, cb)                                     => undefined,
    releasedir:  (path, fd, cb)                                     => undefined,
    create:      (path, mode, cb)                                   => undefined,
    utimens:     (path, atime, mtime, cb)                           => undefined,
    unlink:      (path, cb)                                         => undefined,
    rename:      (src, dest, cb)                                    => undefined,
    link:        (src, dest, cb)                                    => undefined,
    symlink:     (src, dest, cb)                                    => undefined,
    mkdir:       (path, mode, cb)                                   => undefined,
    rmdir:       (path, cb)                                         => undefined,
    destroy:     (cb)                                               => undefined
}

exports.real = function (basePath) {
    return {
        access:      (path, mode, cb)                                   => undefined,
        statfs:      (path, cb)                                         => undefined,
        getattr:     (path, cb)                                         => undefined,
        fgetattr:    (path, fd, cb)                                     => undefined,
        flush:       (path, fd, cb)                                     => undefined,
        fsync:       (path, fd, datasync, cb)                           => undefined,
        readdir:     (path, cb)                                         => undefined,
        truncate:    (path, size, cb)                                   => undefined,
        ftruncate:   (path, fd, size, cb)                               => undefined,
        readlink:    (path, cb)                                         => undefined,
        chown:       (path, uid, gid, cb)                               => undefined,
        chmod:       (path, mode, cb)                                   => undefined,
        mknod:       (path, mode, dev, cb)                              => undefined,
        setxattr:    (path, name, buffer, length, offset, flags, cb)    => undefined,
        getxattr:    (path, name, length, offset, cb)                   => undefined,
        listxattr:   (path, buffer, length, cb)                         => undefined,
        removexattr: (path, name, cb)                                   => undefined,
        open:        (path, flags, cb)                                  => undefined,
        opendir:     (path, flags, cb)                                  => undefined,
        read:        (path, fd, length, offset, cb)                     => undefined,
        write:       (path, fd, buffer, length, offset, cb)             => undefined,
        release:     (path, fd, cb)                                     => undefined,
        releasedir:  (path, fd, cb)                                     => undefined,
        create:      (path, mode, cb)                                   => undefined,
        utimens:     (path, atime, mtime, cb)                           => undefined,
        unlink:      (path, cb)                                         => undefined,
        rename:      (path, dest, cb)                                   => undefined,
        link:        (path, dest, cb)                                   => undefined,
        symlink:     (path, dest, cb)                                   => undefined,
        mkdir:       (path, mode, cb)                                   => undefined,
        rmdir:       (path, cb)                                         => undefined
    }
}

exports.readOnly = function (other) {
    return {
        statfs:      other.statfs,
        getattr:     other.getattr,
        fgetattr:    other.fgetattr,
        readdir:     other.readdir,
        readlink:    other.readlink,
        getxattr:    other.getxattr,
        listxattr:   other.listxattr,
        open:        (path, flags, cb) => flags & 3 === 0 ? other.open(path, flags, cb) : cb(NO),
        opendir:     other.opendir,
        read:        other.read,
        release:     other.release,
        releasedir:  other.releasedir
    }
}

exports.vFile = function (buffer) {
    return {
        getattr: (path, cb) => cb([0, {
            mtime: stdDate,
            atime: stdDate,
            ctime: stdDate,
            nlink: 1,
            size: buffer.length,
            mode: 33188,
            uid: uid,
            gid: gid
        }]),
        open: (path, flags, cb) => cb(flags & 3 === 0 ? [0, 42] : NO),
        read: (path, fd, length, offset, cb) => {
            let nb = buffer.slice(offset, offset + length)
            cb([nb.length, nb])
        },
    }
}

exports.vDir = function (entries) {
    let dirOperations = {
        getattr: (path, cb) => cb([0, dirAttributes]),
        readdir: (path, cb) => cb([0, Object.keys(entries)])
    }
    return new Proxy({}, {
        get: (target, operation, receiver) => function () {
            let args = Array.from(arguments)
            let pathItems = args[0]
            let cb = args[args.length - 1]
            let operations = pathItems.length > 0 ? entries[pathItems.shift()] : dirOperations
            console.log('Operation(s):', operations, operation)
            if (operations) {
                let operationFunction = operations[operation]
                if (operationFunction) {
                    console.log('Applying: ', operationFunction, args)
                    operationFunction.apply(null, args)
                } else {
                    cb(NO)
                }
            } else {
                cb(NO)
            }
        }
    })
}

exports.serve = function (root, call, cb) {
    let wrap = args => cb(serializer.toBuffer(args))
    if (!root) {
        wrap(NO)
    }
    call = serializer.fromBuffer(call)
    let operation = root[call.operation]
    if (operation) {
        if (call.args.length > 0) {
            let args = call.args
            args[0] = args[0].split('/').filter(v => v.length > 0)
            args = args.concat([wrap])
            console.log('Applying: ', operation, args)
            operation.apply(null, args)
        } else {
            wrap(NO)
        }
    } else {
        wrap(NO)
    }
}
