import Foundation
import RaycastSwiftMacros
import AppKit
import CoreGraphics


struct AppInfo: Encodable {
    let name: String
    let icon: String
}

@raycast func getRunningAppInfos() -> [AppInfo] {
    let workspace = NSWorkspace()
    let apps = workspace.runningApplications.filter { $0.activationPolicy == NSApplication.ActivationPolicy.regular }

    let appInfos = apps.compactMap { app -> AppInfo? in
        guard let name = app.localizedName, let bundleURL = app.bundleURL else {
            return nil
        }

        let infoPlistPath = bundleURL.appendingPathComponent("Contents/Info.plist")

        guard let infoPlist = NSDictionary(contentsOf: infoPlistPath) as? [String: Any],
              var iconFile = infoPlist["CFBundleIconFile"] as? String else {
            return nil
        }

        if !iconFile.hasSuffix(".icns") {
            iconFile += ".icns"
        }

        let iconPath = bundleURL.appendingPathComponent("Contents/Resources/\(iconFile)").path

        return AppInfo(name: name, icon: iconPath)
    }

    return appInfos
}
