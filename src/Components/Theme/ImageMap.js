import ResizableDraggable from "./ResizableDragable";

const ImageMap = ({attributes,setActiveIndex,updateItem}) => {
  const { maps, img } = attributes;
  return (
  <div className="bpivbImageMap">
      <img src={img?.url} alt={img?.title} />
      {maps?.map((image, index) => {
        return (
          <ResizableDraggable
            key={index}
            bgColor={image?.mapColor}
            shape={image?.shape}
            mapBorder={image?.mapBorder}
            onClick={() => setActiveIndex(index)}
            value={image}
            onChange={(info) => updateItem(index, { ...image, ...info })}
          />
        );
      })}
    </div>
  )
}

export default ImageMap;
