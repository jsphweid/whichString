import { Array1D, NDArrayMathGPU, Scalar } from 'deeplearn'


export default class Train {

    static buildModel() {

        const math = new NDArrayMathGPU()
        const a = Array1D.new([1, 2, 3])
        const b = Scalar.new(2)
        math.scope(() => {
            const result = math.add(a, b)
            console.log(result.getValues())
        })

    }

}