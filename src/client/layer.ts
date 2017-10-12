import {LayerBuilder, LayerName, LayerWeightsDict} from "../shared/types";
import Model from "./model";
import {Graph, Tensor} from "deeplearn";

export class Layer {

    inputShapeDisplay: string;
    outputShapeDisplay: string;
    private layerNames: LayerName[];
    private selectedLayerName: LayerName;
    private hasError: boolean;
    private errorMessages: string[];

    private model: Model;
    layerBuilder: LayerBuilder;
    private inputShape: number[];
    private outputShape: number[];

    initialize(model: Model, inputShape: number[]) {
        this.model = model;
    }

    setInputShape(shape: number[]): number[] {
        this.inputShape = shape;

        const errors: string[] = [];
        const validationErrors = this.layerBuilder.validate(this.inputShape);
        if (validationErrors != null) {
            for (let i = 0; i < validationErrors.length; i++) {
                errors.push('Error: ' + validationErrors[i]);
            }
        }

        try {
            this.outputShape = this.layerBuilder.getOutputShape(this.inputShape);
        } catch (e) {
            errors.push(e);
        }

        if (errors.length > 0) {
            this.hasError = true;
            this.errorMessages = errors;
        } else {
            this.hasError = false;
            this.errorMessages = [];
        }

        return this.outputShape;
    }

    isValid(): boolean {
        return !this.hasError;
    }

    getOutputShape(): number[] {
        return this.outputShape;
    }

    addLayer(g: Graph, network: Tensor, index: number, weights: LayerWeightsDict | null): Tensor {
        return this.layerBuilder.addLayer(g, network, this.inputShape, index, weights)
    }

    // buildParamsUI(
    //     layerName: LayerName, inputShape: number[],
    //     layerBuilderJson?: LayerBuilder) {
    //     this.selectedLayerName = layerName;
    //
    //     this.layerBuilder =
    //         layer_builder.getLayerBuilder(layerName, layerBuilderJson);
    //
    //     // Clear any existing parameters.
    //     this.paramContainer.innerHTML = '';
    //
    //     // Add all the parameters to the UI.
    //     const layerParams = this.layerBuilder.getLayerParams();
    //     for (let i = 0; i < layerParams.length; i++) {
    //         const initialValue = layerBuilderJson != null ?
    //             layerParams[i].getValue() :
    //             layerParams[i].initialValue(inputShape);
    //         this.addParamField(
    //             layerParams[i].label, initialValue, layerParams[i].setValue,
    //             layerParams[i].type, layerParams[i].min, layerParams[i].max);
    //     }
    //     this.Model.layerParamChanged();
    // }

    // loadParamsFromLayerBuilder(
    //     inputShape: number[], layerBuilderJson: LayerBuilder) {
    //     this.buildParamsUI(
    //         layerBuilderJson.layerName, inputShape, layerBuilderJson);
    // }
    //
    // private addParamField(
    //     label: string, initialValue: number|string,
    //     setValue: (value: number|string) => void, type: 'number'|'text',
    //     min?: number, max?: number) {
    //     const input = document.createElement('paper-input');
    //     input.setAttribute('always-float-label', 'true');
    //     input.setAttribute('label', label);
    //     input.setAttribute('value', '' + initialValue);
    //     input.setAttribute('type', type);
    //     if (type === 'number') {
    //         input.setAttribute('min', '' + min);
    //         input.setAttribute('max', '' + max);
    //     }
    //     input.className = 'param-input';
    //     this.paramContainer.appendChild(input);
    //
    //     // Update the parent when this changes.
    //     input.addEventListener('input', (event) => {
    //         if (type === 'number') {
    //             // tslint:disable-next-line:no-any
    //             setValue((event.target as any).valueAsNumber as number);
    //         } else {
    //             // tslint:disable-next-line:no-any
    //             setValue((event.target as any).value as string);
    //         }
    //         this.Model.layerParamChanged();
    //     });
    //     setValue(initialValue);
    // }
}