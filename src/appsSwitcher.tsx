import { Action, ActionPanel, closeMainWindow, List } from "@raycast/api";
import { usePromise } from "@raycast/utils";
import { exec } from "child_process";
import { useState } from "react";
import { getRunningAppInfos } from "swift:../swift";

export default function Command() {
  const [filteredApplications, setFilteredApplications] = useState<string[]>([]);
  const {
    isLoading,
    data: runningApps,
    error,
  } = usePromise(async () => {
    const apps = await getRunningAppInfos();
    setFilteredApplications(apps);
    return apps;
  });

  const [searchText, setSearchText] = useState<string>("");

  const focusApplication = async (appName: string) => {
    exec(`osascript -e 'tell application "${appName}" to activate'`, (error) => {
      if (error) {
        console.error(`Failed to focus application ${appName}:`, error);
      } else {
        setSearchText("");
        setFilteredApplications(runningApps || []);
      }
    });
    await closeMainWindow({ clearRootSearch: true });
  };

  const handleSearch = (query: string) => {
    setSearchText(query);
    const filtered = runningApps?.filter((app) => app.toLowerCase().includes(query.toLowerCase()));
    if (filtered?.length === 1) {
      focusApplication(filtered[0]);
    }

    setFilteredApplications(filtered || []);
  };

  return (
    <List onSearchTextChange={handleSearch} searchText={searchText} isLoading={isLoading}>
      {filteredApplications?.map((app, index) => (
        <List.Item
          key={index}
          title={app}
          actions={
            <ActionPanel>
              <Action title="Focus Application" onAction={() => focusApplication(app)} />
            </ActionPanel>
          }
        />
      )) ||
        (error && <List.Item title={`Error: ${error.message}`} />) || <List.Item title="Loading..." />}
    </List>
  );
}
