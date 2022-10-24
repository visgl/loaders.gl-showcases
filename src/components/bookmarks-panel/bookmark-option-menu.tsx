import { useTheme } from "styled-components";
import DownloadBookmarkIcon from "../../../public/icons/download-bookmark.svg";
import DeleteIcon from "../../../public/icons/delete.svg";
import UploadBookmarkIcon from "../../../public/icons/upload-bookmark.svg";
import EditBookmarkIcon from "../../../public/icons/edit.svg";
import CollapseIcon from "../../../public/icons/collapse.svg";
import { color_accent_primary } from "../../constants/colors";
import {
  MenuContainer,
  MenuItem,
  MenuSettingsIcon,
  MenuDevider,
} from "../comparison/common";
import { useAppLayout } from "../../utils/layout";
import { Layout } from "../../utils/enums";

type BookmarkOptionsMenuProps = {
  showDeleteBookmarksOption: boolean;
  onEditBookmarks: () => void;
  onClearBookmarks: () => void;
  onDownloadBookmarks: () => void;
  onUploadBookmarks: () => void;
  onCollapsed: () => void;
};

export const BookmarkOptionsMenu = ({
  showDeleteBookmarksOption,
  onEditBookmarks,
  onClearBookmarks,
  onDownloadBookmarks,
  onUploadBookmarks,
  onCollapsed,
}: BookmarkOptionsMenuProps) => {
  const theme = useTheme();
  const layout = useAppLayout();

  return (
    <MenuContainer>
      <MenuItem onClick={onEditBookmarks}>
        <MenuSettingsIcon>
          <EditBookmarkIcon fill={theme.colors.fontColor} />
        </MenuSettingsIcon>
        Edit Bookmark
      </MenuItem>

      <MenuItem onClick={onDownloadBookmarks}>
        <MenuSettingsIcon>
          <DownloadBookmarkIcon fill={theme.colors.fontColor} />
        </MenuSettingsIcon>
        Download file
      </MenuItem>

      <MenuItem onClick={onUploadBookmarks}>
        <MenuSettingsIcon>
          <UploadBookmarkIcon fill={theme.colors.fontColor} />
        </MenuSettingsIcon>
        Upload bookmarks
      </MenuItem>

      {layout !== Layout.Desktop && (
        <MenuItem onClick={onCollapsed}>
          <MenuSettingsIcon>
            <CollapseIcon fill={theme.colors.fontColor} />
          </MenuSettingsIcon>
          Collapse panel
        </MenuItem>
      )}
      {showDeleteBookmarksOption && (
        <>
          <MenuDevider />
          <MenuItem
            customColor={color_accent_primary}
            opacity={0.8}
            onClick={onClearBookmarks}
          >
            <MenuSettingsIcon>
              <DeleteIcon fill={color_accent_primary} />
            </MenuSettingsIcon>
            Clear bookmarks
          </MenuItem>
        </>
      )}
    </MenuContainer>
  );
};
