function value(n) {
    return n + 100
}

function gridValue(parm) {
    console.log(parm.u)
    return gaussModel(parm)
}

//高斯模型
//参数： p{}
function gaussModel(p) {
    // let sigx = 1, sigy = 1, sigz = 1, y = 1
    let uv = p.u
    let vv = p.v
    let u = Math.sqrt(uv ** 2 + vv ** 2)
    let sina = vv / u
    let cosa = uv / u
    console.log(u)
    let res = []
    let xlen = 1
    let ylen = 1

    let t = 0.5
    let Q = 1
    let sig = diffCoeffient(pasStabClass(u, 'Day', 'sunshine'))

    for (let x = -1; x < 1; x += 0.02) {

        for (let y = -1; y < 1; y += 0.02) {

            if ((1 + 0.0004 * x) < 0 || (1 + sig[2] * x) < 0) {
                res.push([x * 100, y * 100, 0])
                continue
            }
            let sigx = sig[0] * x * Math.sqrt(1 + 0.0004 * x)
            let sigy = sigx
            let sigz = sig[1] * x * Math.sqrt(1 + sig[2] * x)
            let c = 2 * Q / ((2 * Math.PI) ** 1.5 * sigx * sigy * sigz)
                * Math.E ** (-1 * y ** 2 / (2 * sigy ** 2))
                * Math.E ** (-1 * (x - u * t) ** 2 / (2 * sigx ** 2))
            res.push([Math.round(x * 50), Math.round(y * 50), c > 0 ? c : 0])
        }

    }
    res = res.map(i => [cosa * i[0] - sina * i[1], sina * i[0] + cosa * i[1], i[2]])
    return res
}

//确定大气稳定度级别
//参数： 风速、白天/黑夜，天气
function pasStabClass(u, time, w) {
    let stabClass = [
        ['A', 'A', 'B', 'E', 'F', 'D'],
        ['B', 'B', 'C', 'E', 'F', 'D'],
        ['C', 'C', 'C', 'D', 'F', 'D'],
        ['C', 'D', 'D', 'D', 'D', 'D']
    ]
    let yIndex = {
        'Day': {
            'sunshine': 0,
            'cloudy': 1,
            'overcast': 2,
            'heavy cloudy': 5
        },
        'Night': {
            'cloudy': 3,
            'little cloudy': 4,
            'heavy cloudy': 5
        }
    }
    let xIndex = -1
    if (0 < u && u <= 2)
        xIndex = 0
    else if (2 < u && u <= 4)
        xIndex = 1
    else if (4 < u && u <= 6)
        xIndex = 2
    else
        xIndex = 3

    return stabClass[xIndex][yIndex[time][w]]
}

//确定传播系数
//参数： 大气稳定度
function diffCoeffient(c) {
    let p = {
        'A': [0.32, 0.24, 0.001],
        'B': [0.32, 0.24, 0.001],
        'C': [0.22, 0.2, 0],
        'D': [0.16, 0.14, 0.003],
        'E': [0.11, 0.08, 0.0015],
        'F': [0.11, 0.08, 0.0015]
    }
    return p[c]
}

module.exports = {
    value: value,
    gridValue: gridValue,
    pasStabClass: pasStabClass
}