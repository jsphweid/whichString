export interface AdaptiveType {
    phone: boolean
    tablet: boolean
}

// only powers of 2 that have sqrt as whole number -> can reshape into a square
export type FFTSizeType =  256 | 1024 | 4096
