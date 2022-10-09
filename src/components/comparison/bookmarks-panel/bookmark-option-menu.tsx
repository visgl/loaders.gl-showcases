import { useTheme } from "styled-components";
import DownloadBookmarkIcon from "../../../../public/icons/download-bookmark.svg";
import DeleteIcon from "../../../../public/icons/delete.svg";
import UploadBookmarkIcon from "../../../../public/icons/upload-bookmark.svg";
import EditBookmarkIcon from "../../../../public/icons/edit.svg";
import { color_accent_primary } from "../../../constants/colors";
import {
  MenuContainer,
  MenuItem,
  MenuSettingsIcon,
  MenuDevider,
} from "../common";

type BookmarkOptionsMenuProps = {
  onEditBookmark: () => void;
  onClearBookmarks: () => void;
  onUploadBookmarks: () => void;
};

export const BookmarkOptionsMenu = ({
  onEditBookmark,
  onClearBookmarks,
  onUploadBookmarks,
}: BookmarkOptionsMenuProps) => {
  const theme = useTheme();

  return (
    <MenuContainer>
      <MenuItem onClick={onEditBookmark}>
        <MenuSettingsIcon>
          <EditBookmarkIcon fill={theme.colors.fontColor} />
        </MenuSettingsIcon>
        Edit Bookmark
      </MenuItem>

      <MenuItem>
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
    </MenuContainer>
  );
};
