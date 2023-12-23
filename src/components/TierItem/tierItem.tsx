import { TierElement } from "../../pages/Home/index";

type Props = {
    itemData: TierElement;
    onItemDragStart: (tierListIndex: number, tierElementIndex: number) => void;
    onItemDragEnter: (tierListIndex: number, tierElementIndex: number) => void;
    onItemDragEnd: (tierListIndex: number, tierElementIndex: number) => void;
    elementIndex: number;
    parentTierListIndex: number;
}

export const TierItem = ({ itemData, elementIndex, parentTierListIndex, ...props }: Props) => {

    return(
          <div
            key={itemData.id}
            class="list-items"
            draggable
            onDragStart={() => props.onItemDragStart(parentTierListIndex, elementIndex)}
            onDragEnter={() => props.onItemDragEnter(parentTierListIndex, elementIndex)}
            onDragEnd={(e) => props.onItemDragEnd(parentTierListIndex, elementIndex)}
            onDragOver={(e) => e.preventDefault()}
          >
            <img src={itemData.image} alt="" />
          </div>
    )
}