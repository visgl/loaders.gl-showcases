import { Sublayer } from "../types";

export class ActiveSublayer implements Sublayer {
    id: number;
    name: string;
    alias?: string | undefined;
    discipline?: "Mechanical" | "Architectural" | "Piping" | "Electrical" | "Structural" | undefined;
    modelName?: string | undefined;
    layerType: "group" | "3DObject" | "Point";
    visibility?: boolean | undefined;
    sublayers: ActiveSublayer[];
    isEmpty?: boolean | undefined;
    url?: string | undefined;
    expanded: boolean;
    childNodesCount: number;

    constructor (sublayer: Sublayer, checkVisibility?: boolean) {
        this.id = sublayer.id;
        this.name = sublayer.name;
        this.alias = sublayer.alias;
        this.discipline = sublayer.discipline;
        this.modelName = sublayer.modelName;
        this.layerType = sublayer.layerType;
        this.visibility = sublayer.visibility;
        this.sublayers = sublayer.sublayers?.map(sublayer => new ActiveSublayer(sublayer))??[];
        this.isEmpty = sublayer.isEmpty;
        this.url = sublayer.url;
        this.expanded = sublayer.expanded;
        this.childNodesCount = sublayer.childNodesCount;
        if (checkVisibility) {
            this.setAllTreeBranchVisibility()
        }
    }
    
    isLeaf = (): boolean => {
        return !(this.sublayers?.length > 0)
    }

    /**
     * Sets visibility for the whole subtree
     * @param {boolean} visibility - Visibility to set for subtree
     * @returns {ActiveSublayer[]} - list of changed leafs
     */
    setVisibility = (visibility: boolean): ActiveSublayer[] => {
        this.visibility = visibility;
        if (!this.isLeaf()) {
            return this.sublayers.reduce((res, sublayer) => res.concat(sublayer.setVisibility(visibility)), [] as ActiveSublayer[])
        }
        else {
            return [this]
        }
    }

    setAllTreeBranchVisibility = () => {
        if (!this.isLeaf()) {
            this.visibility = this.sublayers.reduce<boolean>((res, sublayer) => {
                if (sublayer.isLeaf()) {
                    return res && (sublayer.visibility??false)
                } else {
                    sublayer.setAllTreeBranchVisibility();
                    return res && (sublayer.visibility??false)
                }
            }, true)
        }
    }

    onChildVisibilityChange = () => {
        if (!this.isLeaf()) {
            this.visibility = this.sublayers.find(sublayer => !(sublayer.visibility)) === undefined
        }
    }
}
