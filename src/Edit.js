import { useBlockProps } from "@wordpress/block-editor";
import { useState, useEffect, useRef } from "react";
import { produce } from "immer";
import {withSelect } from '@wordpress/data';
import { tabController } from "../../bpl-tools/utils/functions";
import Style from "./Style";
import Viewer from "./Viewer";
import ClipBoard from "../src/admin/ClipBoard/shortCodeUI/ClipBoard";
import Settings from "./Components/Settings/Settings";

const Edit = (props) => {
  const {  attributes, setAttributes, clientId, isSelected, bpivbType, currentPostId,device } = props;

  const { maps} = attributes;

  //akne Attributes aer cId ta update korteci
  useEffect(() => {
    clientId && setAttributes({ cId: clientId.substring(0, 10) });
  }, [clientId]);

  useEffect(() => tabController(), [isSelected]);

  const [activeIndex, setActiveIndex] = useState(0);

  const [overly, setOverly] = useState(false);
  const mainArea = useRef();

  const addPosition = () => {
    setAttributes({
      maps: [
        ...maps,
        {
          mapColor: "#ddd6",
          mapBorder: {
            color: "#080714e0",
            width: "0px",
            style: "solid",
          },
          top: 100,
          left: 100,
          width: 100,
          height: 100,
          shape: "rect",
          link: "https://bplugins.com/",
          title: "bPlugins",
          target: "_blank",
        },
      ],
    });
  };

  const removePosition = (index) => {
    const remove = [...maps];
    remove.splice(index, 1);
    setAttributes({ maps: remove });
    setActiveIndex(0 === activeIndex ? 0 : activeIndex - 1);
  };

  const updateItem = (index, val, type = "") => {
    const newItem = produce(maps, (draft) => {
      if (type) {
        draft[index][type] = val;
      } else {
        draft[index] = val;
      }
    });
    setAttributes({ maps: newItem });
  };

useEffect(() => {
  const handler = (e) => {
    if (!mainArea.current?.contains(e.target)) {
      setOverly(false);
    }
  };

  // Iframe-এর ডকুমেন্ট ধরছি
  const doc = mainArea.current?.ownerDocument || document;
  doc.addEventListener("mousedown", handler);

  // যদি Iframe এ থাকে, তবে বাইরের ক্লিক ধরার জন্য মূল উইন্ডোতেও লিসেনার অ্যাড করছি
  if (doc !== document) {
    document.addEventListener("mousedown", handler);
  }

  return () => {
    doc.removeEventListener("mousedown", handler);
    if (doc !== document) {
      document.removeEventListener("mousedown", handler);
    }
  };
}, []);


  //UTILS AER FUNCTION.JS AER MODDHE  ID TA JASCHE
  const id = `bpivbImageViewer-${clientId}`


  //shortCode
  const isBlockEditor = window?.wp?.blockEditor;


  //hotspot
  const isBackend = true;


  return (
    <div {...useBlockProps({ draggable: false })}>
      <Settings
        attributes={attributes}
        setAttributes={setAttributes}
        activeIndex={activeIndex}
        addPosition={addPosition}
        removePosition={removePosition}
        setActiveIndex={setActiveIndex}
        updateItem={updateItem}
        device={device}
      />

      <div id={id}>
        <Style attributes={attributes} id={id} device={device} />

        {isBlockEditor && bpivbType === "bpivb" && (
          <ClipBoard shortCode={`[bpivb id=${currentPostId}]`} />
        )}

        <div
          ref={mainArea}
          className={`bpivbImageViewer ${overly ? "overly" : ""}`}
          onClick={() => setOverly(true)}
        >
          <Viewer
            attributes={attributes}
            clientId={id}
            setActiveIndex={setActiveIndex}
            updateItem={updateItem}
            setAttributes={setAttributes}
            isBackend={isBackend}
            device={device}
          />
        </div>
      </div>
    </div>
  );
};
// export default Edit;
export default withSelect(select => {
  // apiVersion 3 compatible: core/edit-post → core/edit-site → core/editor fallback
  const editPost = select('core/edit-post');
  const editSite = select('core/edit-site');
  const editor   = select('core/editor');

  const getDeviceType =
    editPost?.getDeviceType ||
    editSite?.getDeviceType ||
    editor?.getDeviceType;

  const currentPostId = editor?.getCurrentPostId?.();
  const bpivbType     = editor?.getCurrentPostType?.();

  return {
    device: getDeviceType?.()?.toLowerCase() || 'desktop',
    currentPostId,
    bpivbType,
  };
})(Edit);
