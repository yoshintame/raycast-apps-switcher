import Foundation
import RaycastSwiftMacros
import AppKit
import CoreGraphics

@raycast func getRunningAppInfos() -> [String] {
    let workspace = NSWorkspace()

    let apps = workspace.runningApplications.filter { $0.activationPolicy == NSApplication.ActivationPolicy.regular }

    let appInfos = apps.compactMap { app -> String? in
        guard let name = app.localizedName else {
            return nil
        }

        return name
    }

    return appInfos
}

