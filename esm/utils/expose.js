export function proxy({ algoithms, methods }) {
    return {
        async encode(image, mask, options) {
            const { data, height, width } = await algoithms[options.version].encode(methods.preprocessImage(await methods.toImageData(image)), methods.preprocessImage(await methods.toImageData(mask)), options);
            return methods.toBuffer(data, height, width);
        },
        async decode(image, mask, options) {
            return algoithms[options.version].decode(await methods.toImageData(image), await methods.toImageData(mask), options);
        },
    };
}
//# sourceMappingURL=expose.js.map