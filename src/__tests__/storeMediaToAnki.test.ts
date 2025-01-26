import BgAnkiConnect from '../backgroundService/bgAnkiConnect';

const downloadDir = "/Users/a123/Downloads/"

describe(BgAnkiConnect,()=>{
    const ankiConnect = new BgAnkiConnect()

    it("store media to anki", async()=>{
        const mediaStoreRes = await ankiConnect.storeMedia(downloadDir,"OST-going.webm")
        console.log(mediaStoreRes)
    })
})