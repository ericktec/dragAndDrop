import "./style.css";
import { Fragment } from "preact";
import {
  useState,
  useRef,
  useMemo,
  useEffect,
} from "preact/hooks";
import { TierItem } from "../../components/TierItem/tierItem";
import { socket } from "../../customHooks/socket";

export type Tier = {
  id: string;
  name: string;
  tierColor: string;
  elements: Array<TierElement>;
};

export type TierElement = {
  id: string;
  image: string;
};


const INITIAL_TIERS: Array<Tier> = [
  { id: "id0", name: "S", tierColor: "var(--tier-color-red)", elements: [] },
  { id: "id1", name: "A", tierColor: "var(--tier-color-orange)", elements: [] },
  { id: "id2", name: "B", tierColor: "var(--tier-color-yellow)", elements: [] },
  { id: "id3", name: "C", tierColor: "var(--tier-color-green)", elements: [] },
  {
    id: "id4",
    name: "Elements",
    tierColor: "var(--tier-color-transparent)",
    elements: [],
  },
];

export function Home() {
  const [tiers, setTiers] = useState<Array<Tier>>(INITIAL_TIERS);

  const draggedOverTierContainer = useRef<{ tierIndex: number }>(null);
  const draggedOverTierItem = useRef<{
    tierIndex: number;
    elementIndex: number;
  }>(null);
  const draggedItem = useRef<{ tierIndex: number; elementIndex: number }>(null);

  useEffect(() => {
    function onConnect() {
      
    }
    
    function onDisconnect() {

    }

    function onUserConnected(tierData: Array<Tier>) {
      setTiers(tierData)
    }

    function onSyncTierList(tierData: Array<Tier>) {
      setTiers(tierData);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("userConnected", onUserConnected);
    socket.on("syncTierList", onSyncTierList);

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("userConnected");
      socket.off("synctierList");
    }
  }, []);

  // Drag events for tier list
  const onTierListContainerDragEnter = (tierListIndex: number) => {
    draggedOverTierContainer.current = {
      tierIndex: tierListIndex,
    };
  };

  // Drag events for items
  const onItemDragStart = (tierListIndex: number, tierElementIndex: number) => {
    draggedItem.current = {
      tierIndex: tierListIndex,
      elementIndex: tierElementIndex,
    };
  };

  const onItemDragEnter = (tierListIndex: number, tierElementIndex: number) => {
    draggedOverTierItem.current = {
      tierIndex: tierListIndex,
      elementIndex: tierElementIndex,
    };
  };

  const onItemDragEnd = () => {
    if (
      (draggedOverTierContainer.current === null && draggedOverTierItem.current === null) ||
      draggedItem.current === null
    )
      return;
    setTiers((prevTier) => {
      const newTierList = prevTier.map((tier) => {
        return { ...tier, elements: [...tier.elements] };
      });

      if (draggedOverTierContainer.current.tierIndex === undefined) return;

      const currentDragItem =
        newTierList[draggedItem.current.tierIndex].elements[
          draggedItem.current.elementIndex
        ];
      newTierList[draggedItem.current.tierIndex].elements.splice(
        draggedItem.current.elementIndex,
        1
      );
      if (
        draggedOverTierContainer.current.tierIndex !==
        draggedOverTierItem.current.tierIndex
      ) {
        newTierList[draggedOverTierContainer.current.tierIndex].elements.push(
          currentDragItem
        );
      } else if (
        draggedOverTierContainer.current.tierIndex ===
        draggedOverTierItem.current.tierIndex
      ) {
        newTierList[draggedOverTierContainer.current.tierIndex].elements.splice(
          draggedOverTierItem.current.elementIndex,
          0,
          currentDragItem
        );
      }
      socket.emit("onTierListItemChanged", [...newTierList]);
      return [...newTierList];
    });
  };

  return (
    <Fragment>
      <div class="list-layout">
        {tiers.map((tier, tierIndex) => (
          <Fragment key={tier.id}>
            <div
              class="tier-name__container"
              style={{ backgroundColor: tier.tierColor }}
            >
              {tier.name}
            </div>
            <div
              class="tier-items__container"
              onDragEnter={() => onTierListContainerDragEnter(tierIndex)}
              onDragOver={(e) => e.preventDefault()}
            >
              {tier.elements.map((elem, elementIndex) => (
                <TierItem
                  itemData={elem}
                  elementIndex={elementIndex}
                  parentTierListIndex={tierIndex}
                  onItemDragStart={onItemDragStart}
                  onItemDragEnd={onItemDragEnd}
                  onItemDragEnter={onItemDragEnter}
                ></TierItem>
              ))}
            </div>
          </Fragment>
        ))}
      </div>
    </Fragment>
  );
}
