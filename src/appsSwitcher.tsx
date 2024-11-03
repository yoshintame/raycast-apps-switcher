import { List } from "@raycast/api";
import { usePromise } from "@raycast/utils";
import { getRunningAppInfos } from "swift:../swift";

export default function Command() {
  const { isLoading, data, error } = usePromise(async () => {
    const colors = await getRunningAppInfos();
    return colors;
  });

  return (
    <List isLoading={isLoading}>
      {data?.map((color, index) => <List.Item key={index} title={color} />) ||
        (error && <List.Item title={`Error: ${error.message}`} />) || <List.Item title="Loading..." />}
    </List>
  );
}
