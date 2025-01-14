const fetch = require("cross-fetch");
module.exports = async (slip) => {
    let { isError, data } = await fetch(process.env.SLIPENDPOINT+slip, {
        method: "GET",
        headers: {
			'Authorization': "Bearer "+process.env.SLIPKEY
        }
    }).then(async (res) => ({ isError: !res.ok, data: await res.json() })).catch(() => ({ isError: true, data: null }));

    if (data.status == 200 || !isError) {
        let transferDate = new Date(data?.data?.date).getTime() / 1000;
        if (new Date().getTime() / 1000 < transferDate + 900)
            return {
                isError: true,
                msg: "ไม่สามารถใช้สลิปที่มากกว่า 15 นาทีได้!",
                code: 0,
            }
        else return {
            isError: false,
            msg: "สำเร็จ!",
            code: 1,
            data: data
        }
    } else {
        if (data?.status?.code == 1002) {
            return {
                isError: true,
                msg: "ขณะนี้มีผู้ใช้งานจำนวนมาก โปรดลองใหม่อีกครั้งใน 2-3 นาที",
                code: 0,
            };
        }
        return {
            isError: true,
            msg: data,
            code: 0,
        }
    }
}
