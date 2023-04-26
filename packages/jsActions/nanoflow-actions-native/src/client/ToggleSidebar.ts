// This file was generated by Mendix Studio Pro.
//
// WARNING: Only the following code will be retained when actions are regenerated:
// - the import list
// - the code between BEGIN USER CODE and END USER CODE
// - the code between BEGIN EXTRA CODE and END EXTRA CODE
// Other code you write will be lost the next time you deploy the project.

// BEGIN EXTRA CODE
// END EXTRA CODE

/**
 * Toggle the sidebar.
 * @returns {Promise.<void>}
 */
export async function ToggleSidebar(): Promise<void> {
    // BEGIN USER CODE

    mx.ui.toggleSidebar();

    // Web platform
    if (window && !(navigator && navigator.product === "ReactNative")) {
        document.dispatchEvent(new CustomEvent("toggleSidebar"));
    }

    return Promise.resolve();

    // END USER CODE
}
