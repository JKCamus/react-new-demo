给你一个字符串 s 、一个字符串 t 。返回 s 中涵盖 t 所有字符的最小子串。如果 s 中不存在涵盖 t 所有字符的子串，则返回空字符串 "" 。

输入：s = "ADOBECODEBANC", t = "ABC"
输出："BANC"

输入: s = "a", t = "aa"
输出: ""
解释: t 中两个字符 'a' 均应包含在 s 的子串中，
因此没有符合条件的子字符串，返回空字符串。

1.创建左指针，右指针 2.将输入 t 的所有字符存入，map 中 3.建立循环，直到右指针到 s 字符串长度结束 4.逐位移动右指针 5.如果 need 中有当前右指针的字符，need 中当前右指针字符对应的 value - 1 6.如果当前右指针字符对应的 value === 0 needType -= 1 7.当 needType === 0 时候说明已经找到符合要求的子串开始处理左指针

var minWindow = function(s, t) {
let l = 0
let r = 0
const need = new Map()
for(let c of t){
need.set( c,need.has(c) ? need.get(c) + 1 : 1)
}

    let needType = need.size
    let res = ''
    while(r<s.length){
        let c = s[r]
        if(need.has(c)){
            need.set( c,need.get(c) -1 )
            if( need.get(c) === 0) needType -= 1
        }

        while(needType === 0){
            const newRes = s.substring(l,r+1)
            if( !res || newRes.length < res.length ) res = newRes

            const c2 = s[l]
            if(need.has(c2)){
                need.set(c2,need.get(c2) + 1)
                if( need.get(c2) === 1 ) needType += 1
            }
            l += 1
        }
        r += 1
    }
    return res
    }
