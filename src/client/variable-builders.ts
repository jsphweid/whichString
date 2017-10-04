import {Array1D, Array2D, Array3D, Array4D, Graph} from 'deeplearn'

export default class NodeBuilders {

    static buildVariable(g: Graph, shape: any, name: string) {

        const mean: number = 0 // 0 is default
        const stddev: number = 0.1

        switch(shape.length) {
            case 1:
                return g.variable(name, Array1D.randTruncatedNormal(shape, mean, stddev))
            case 2:
                return g.variable(name, Array2D.randTruncatedNormal(shape, mean, stddev))
            case 3:
                return g.variable(name, Array3D.randTruncatedNormal(shape, mean, stddev))
            case 4:
                return g.variable(name, Array4D.randTruncatedNormal(shape, mean, stddev))

        }

        return g.variable(name, Array4D.randTruncatedNormal(shape, mean, stddev))


    }

}