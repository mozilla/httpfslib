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

exports.real = function (basePath) {
    let getRealPath = (pathItems, cb, cont) => {
        let newPath = path.resolve(basePath, path.join(basePath, ...pathItems))
        if (newPath.startsWith(basePath)) {
            cont(newPath)
        } else {
            cb([unixCodes.EACCES])
        }
    }
    return {
        getattr:    (pathItems, cb)                              => getRealPath(pathItems, cb,
            realPath => fs.stat(realPath,        
                (err, stats) => err ? cb([err.errno || unixCodes.ENOENT]) : cb([0, {
                    mtime: stats.mtime,
                    atime: stats.atime,
                    ctime: stats.ctime,
                    nlink: stats.nlink,
                    size:  stats.size,
                    mode:  stats.mode,
                    uid:   uid,
                    gid:   gid
                }])
            )
        ),
        readdir:    (pathItems, cb)                              => getRealPath(pathItems, cb,
            realPath => fs.readdir(realPath,        
                (err, files) => err ? cb([err.errno || unixCodes.ENOENT]) : cb([0, files])
            )
        ),
        truncate:   (pathItems, size, cb)                        => getRealPath(pathItems, cb,
            realPath => fs.truncate(realPath, size,  
                (err) => cb([err ? (err.errno || unixCodes.ENOENT) : 0])
            )
        ),
        chown:      (pathItems, uid, gid, cb)                    => getRealPath(pathItems, cb,
            realPath => fs.chown(realPath, uid, gid, 
                (err) => cb([err ? (err.errno || unixCodes.ENOENT) : 0])
            )
        ),
        chmod:      (pathItems, mode, cb)                        => getRealPath(pathItems, cb,
            realPath => fs.chmod(realPath, mode,     
                (err) => cb([err ? (err.errno || unixCodes.ENOENT) : 0])
            )
        ),
        read:       (pathItems, fd, length, offset, cb)          => getRealPath(pathItems, cb,
            realPath => {
                let buffer = Buffer.alloc(length)
                let file = fs.open(realPath, 'r', (err, fd) => {
                    if (err) {
                        cb([err.errno || unixCodes.ENOENT])
                    } else {
                        fs.read(fd, buffer, 0, length, offset, 
                            (err, numw) => {
                                if (err) {
                                    cb([err.errno || unixCodes.ENOENT])
                                } else {
                                    fs.close(fd, err => err ? cb([err.errno || unixCodes.ENOENT]) : cb([numw, buffer.slice(0, numw)]))
                                }
                            }
                        )
                    }
                })
            }
        ),
        write:      (pathItems, fd, buffer, offset, cb)  => getRealPath(pathItems, cb,
            realPath => {
                let file = fs.open(realPath, 'w', (err, fd) => {
                    if (err) {
                        cb([err.errno || unixCodes.ENOENT])
                    } else {
                        fs.write(fd, buffer, 0, buffer.length, offset, 
                            (err, numw) => {
                                if (err) {
                                    cb([err.errno || unixCodes.ENOENT])
                                } else {
                                    fs.close(fd, err => cb([err ? (err.errno || unixCodes.ENOENT) : numw]))
                                }
                            }
                        )
                    }
                })
            }
        ),
        create:     (pathItems, mode, cb)                        => getRealPath(pathItems, cb,
            realPath => fs.open(realPath, 'w', mode, (err, fd) => {
                if (err) {
                    cb([err.errno || unixCodes.ENOENT])
                } else {
                    fs.close(fd, err => cb([err ? (err.errno || unixCodes.ENOENT) : 0]))
                }
            })
        ),
        utimens:    (pathItems, atime, mtime, cb)                => getRealPath(pathItems, cb,
            realPath => fs.utimes(realPath, atime, mtime,     
                (err) => cb([err ? (err.errno || unixCodes.ENOENT) : 0])
            )
        ),
        unlink:     (pathItems, cb)                              => getRealPath(pathItems, cb,
            realPath => fs.unlink(realPath,     
                (err) => cb([err ? (err.errno || unixCodes.ENOENT) : 0])
            )
        ),
        rename:     (pathItems, dest, cb)                        => getRealPath(pathItems, cb,
            realPath => getRealPath(dest.split('/').filter(v => v.length > 0), cb, 
                destPath => fs.rename(realPath, destPath,
                    (err) => cb([err ? (err.errno || unixCodes.ENOENT) : 0])
                )
            )
        ),
        mkdir:      (pathItems, mode, cb)                        => getRealPath(pathItems, cb,
            realPath => fs.mkdir(realPath, mode,    
                (err) => cb([err ? (err.errno || unixCodes.ENOENT) : 0])
            )
        ),
        rmdir:      (pathItems, cb)                              => getRealPath(pathItems, cb,
            realPath => fs.rmdir(realPath, 
                (err) => cb([err ? (err.errno || unixCodes.ENOENT) : 0])
            )
        )
    }
}

exports.readOnly = function (other) {
    return {
        getattr:    (pathItems, cb) => other.getattr(pathItems, args => {
            let code = args[0]
            let attr = args[1]
            if (code === 0) {
                attr.mode = attr.mode & 0xffffff6d
                cb([0, attr])
            } else {
                cb([code])
            }
        }),
        readdir:    other.readdir,
        read:       other.read,
        truncate:   (pathItems, size, cb)               => cb([unixCodes.EACCES]),
        chown:      (pathItems, uid, gid, cb)           => cb([unixCodes.EACCES]),
        chmod:      (pathItems, mode, cb)               => cb([unixCodes.EACCES]),
        write:      (pathItems, fd, buffer, offset, cb) => cb([unixCodes.EACCES]),
        create:     (pathItems, mode, cb)               => cb([unixCodes.EACCES]),
        utimens:    (pathItems, atime, mtime, cb)       => cb([unixCodes.EACCES]),
        unlink:     (pathItems, cb)                     => cb([unixCodes.EACCES]),
        rename:     (pathItems, dest, cb)               => cb([unixCodes.EACCES]),
        mkdir:      (pathItems, mode, cb)               => cb([unixCodes.EACCES]),
        rmdir:      (pathItems, cb)                     => cb([unixCodes.EACCES]),
    }
}

exports.vFile = function (buffer) {
    return {
        getattr: (pathItems, cb) => cb([0, {
            mtime: stdDate,
            atime: stdDate,
            ctime: stdDate,
            nlink: 1,
            size: buffer.length,
            mode: 33188,
            uid: uid,
            gid: gid
        }]),
        read: (pathItems, fd, length, offset, cb) => {
            let nb = buffer.slice(offset, offset + length)
            cb([nb.length, nb])
        }
    }
}

exports.vDir = function (entries) {
    let dirOperations = {
        getattr: (pathItems, cb) => cb([0, dirAttributes]),
        readdir: (pathItems, cb) => cb([0, Object.keys(entries)])
    }
    return new Proxy({}, {
        get: (target, operation, receiver) => function () {
            let args = Array.from(arguments)
            let pathItems = args[0]
            let cb = args[args.length - 1]
            if (!cb || {}.toString.call(cb) !== '[object Function]') {
                return
            }
            let operations = pathItems.length > 0 ? entries[pathItems.shift()] : dirOperations
            if (operations) {
                let operationFunction = operations[operation]
                if (operationFunction) {
                    operationFunction.apply(null, args)
                } else {
                    cb([unixCodes.EACCES])
                }
            } else {
                cb([unixCodes.EACCES])
            }
        }
    })
}

exports.serve = function (root, call, cb) {
    let wrap = args => {
        cb(serializer.toBuffer(args))
    }
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
            operation.apply(null, args)
        } else {
            wrap(NO)
        }
    } else {
        wrap([unixCodes.EACCES])
    }
}
