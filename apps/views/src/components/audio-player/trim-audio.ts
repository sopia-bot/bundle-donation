export async function trimAudio(audioBuffer: AudioBuffer, startTime: number, endTime: number) {
    console.log("🚀 ~ trimAudio ~ endTime:", endTime)
    console.log("🚀 ~ trimAudio ~ startTime:", startTime)
    const audioContext = new AudioContext();
    // 원하는 구간의 데이터를 추출
    const sampleRate = audioBuffer.sampleRate;
    const startSample = Math.floor(startTime * sampleRate);
    const endSample = Math.floor(endTime * sampleRate);
    // const trimmedBuffer = audioBuffer.getChannelData(0).slice(startSample, endSample);
    const trimmedBuffer = audioBuffer.getChannelData(0).slice(startTime, endTime);
    
    // 새로운 AudioBuffer 생성
    const newAudioBuffer = audioContext.createBuffer(
        1,
        trimmedBuffer.length,
        sampleRate
    );
    newAudioBuffer.copyToChannel(trimmedBuffer, 0);
    
    // Blob으로 변환
    const offlineContext = new OfflineAudioContext(
        newAudioBuffer.numberOfChannels,
        newAudioBuffer.length,
        sampleRate
    );
    const source = offlineContext.createBufferSource();
    source.buffer = newAudioBuffer;
    
    source.connect(offlineContext.destination);
    source.start();
    
    const renderedBuffer = await offlineContext.startRendering();
    
    // WAV 포맷으로 변환
    return audioBufferToWav(renderedBuffer);
}

function audioBufferToWav(audioBuffer: AudioBuffer) {
    const numOfChan = audioBuffer.numberOfChannels,
    length = audioBuffer.length * numOfChan * 2 + 44,
    buffer = new ArrayBuffer(length),
    view = new DataView(buffer),
    channels = [],
    sampleRate = audioBuffer.sampleRate;
    let offset = 0;
    let pos = 0;
    
    // Write WAV header
    setUint32(0x46464952); // "RIFF"
    setUint32(length - 8); // file length - 8
    setUint32(0x45564157); // "WAVE"
    
    setUint32(0x20746d66); // "fmt " chunk
    setUint32(16); // length = 16
    setUint16(1); // PCM (uncompressed)
    setUint16(numOfChan);
    setUint32(sampleRate);
    setUint32(sampleRate * numOfChan * 2); // avg. bytes/sec
    setUint16(numOfChan * 2); // block-align
    setUint16(16); // bit depth
    
    setUint32(0x61746164); // "data" - chunk
    setUint32(length - pos - 4); // chunk length
    
    for (let i = 0; i < numOfChan; i++)
        channels.push(audioBuffer.getChannelData(i));
    
    while (pos < length) {
        for (let i = 0; i < numOfChan; i++) {
            let sample =
            Math.max(-1, Math.min(1, channels[i][offset])); // clamp
            sample =
            (sample < 0 ? sample * 0x8000 : sample * 0x7fff) | 0; // scale to int16
            view.setInt16(pos, sample, true); // write little-endian
            pos += 2;
        }
        offset++; // next source sample
    }
    
    return new Blob([buffer], { type: "audio/wav" });
    
    function setUint16(data: number) {
        view.setUint16(pos, data, true);
        pos += 2;
    }
    
    function setUint32(data: number) {
        view.setUint32(pos, data, true);
        pos += 4;
    }
}
