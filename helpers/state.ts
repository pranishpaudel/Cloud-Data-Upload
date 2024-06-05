import { atom } from "jotai";

const otpAtom = atom("");
const otpRetryAtom = atom(false);
const updateShowProjectState = atom(false);
const updateShowFolderState = atom(false);
const updateShowFileState = atom(false);
const isOpenFolderButtonClickedAtom = atom(false);
const uploadAtom = atom(false);
const createFolderAtom = atom(false);
const imageToRenderInMixAtom = atom("/defaultImage/default.jpeg");
const openFolderInfo = atom({
  projectId: "",
  projectName: "",
  folderName: "",
});
const skeltonPhotoDimensions = atom({
  width: "",
  height: "",
});
const snapShotDataAtom = atom({});
const reactFormDataAtom = atom(null);
const imageMixLoaderAtom = atom(false);
export {
  otpAtom,
  otpRetryAtom,
  updateShowProjectState,
  imageMixLoaderAtom,
  updateShowFolderState,
  imageToRenderInMixAtom,
  isOpenFolderButtonClickedAtom,
  openFolderInfo,
  uploadAtom,
  skeltonPhotoDimensions,
  createFolderAtom,
  updateShowFileState,
  snapShotDataAtom,
  reactFormDataAtom,
};
