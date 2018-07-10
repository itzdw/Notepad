export function setLocalStorage(id, key, value) {
	let mall = window.localStorage.__mall__
	if (!mall) {
		mall = {}
		mall[id] = {}
	} else {
		mall = JSON.parse(mall)
		if (!mall[id]) {
			mall[id] = {}
		}
	}
	mall[id][key] = value
	window.localStorage.__mall__ = JSON.stringify(mall)
}

export function getLocalStorage(id, key, def) {
	let mall = window.localStorage.__mall__
	if (!mall) {
		return def
	}
	mall = JSON.parse(mall)[id]
	if (!mall) {
		return def
	}
	let ret = mall[key]
	return ret || def
}

/** 
 * cookies的增删查
 */
export const cookies = {
    set: function (name, value) {
        var Days = 7
        var exp = new Date()
        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000)
        document.cookie = name + "=" + encodeURIComponent(value) + ";expires=" + exp.toGMTString()
    },
    get: function (name) {
        var arr, reg = new RegExp("(^| )"+name+"=([^;]*)(;|$)")
        if (arr = document.cookie.match(reg))
            return decodeURIComponent(arr[2])
        else
            return null
    },
    del: function (name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1)
        var cval = this.get(name)
        if (cval != null)
            document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString()
    },
    clear: function(){
        let keys=document.cookie.match(/[^ =;]+(?=\=)/g)
        if (keys) {
            for (let i = keys.length; i--;) 
            document.cookie=keys[i]+'=0;expires=' + new Date(0).toUTCString() 
        }
        document.cookie = ''
    }
}