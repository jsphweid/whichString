import { Array1D } from 'deeplearn'

export interface BatchType {
    inputs: Array1D[]
    labels: Array1D[]
}