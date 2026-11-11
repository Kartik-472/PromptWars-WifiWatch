
export const initialDevices = [
    { id: 1, name: "Kartik's Laptop", ip: "192.168.1.10", mac: "A4:5E:60:2B:91:10", type: "Laptop", status: "Online", trusted: true, usage: 24.5 },
    { id: 2, name: "iPhone 15", ip: "192.168.1.11", mac: "B8:27:EB:4C:12:11", type: "Mobile", status: "Online", trusted: true, usage: 12.2 },
    { id: 3, name: "Samsung Smart TV", ip: "192.168.1.12", mac: "D0:37:45:8A:22:12", type: "Smart TV", status: "Online", trusted: true, usage: 18.7 },
    { id: 4, name: "Unknown Device", ip: "192.168.1.15", mac: "F2:44:91:BC:33:15", type: "Unknown", status: "Online", trusted: false, usage: 8.4 },
    { id: 5, name: "Office Printer", ip: "192.168.1.16", mac: "A8:5C:2C:DE:44:16", type: "Printer", status: "Offline", trusted: true, usage: 0 },
    { id: 6, name: "Gaming Console", ip: "192.168.1.17", mac: "BC:12:56:9F:55:17", type: "Console", status: "Online", trusted: true, usage: 15.8 },
    { id: 7, name: "Unknown Android", ip: "192.168.1.18", mac: "C4:83:72:AB:66:18", type: "Unknown", status: "Online", trusted: false, usage: 5.1 },
    { id: 8, name: "Smart Speaker", ip: "192.168.1.19", mac: "E0:91:53:CD:77:19", type: "IoT", status: "Online", trusted: true, usage: 2.3 }
];

export const initialAlerts = [
    { id: 1, title: "Unknown device detected", description: "An unrecognized device joined the network.", severity: "Medium", time: "2 minutes ago", type: "device", resolved: false },
    { id: 2, title: "Unusual traffic spike", description: "Download activity exceeded the normal baseline.", severity: "High", time: "14 minutes ago", type: "traffic", resolved: false },
    { id: 3, title: "Weak encryption configuration", description: "The simulated router profile uses an outdated security setting.", severity: "High", time: "1 hour ago", type: "configuration", resolved: false },
    { id: 4, title: "New device recognized", description: "A known device connected successfully.", severity: "Low", time: "3 hours ago", type: "device", resolved: true }
];

export const trafficData = [
    { time: "09:00", download: 24, upload: 8 },
    { time: "10:00", download: 38, upload: 12 },
    { time: "11:00", download: 32, upload: 15 },
    { time: "12:00", download: 55, upload: 18 },
    { time: "13:00", download: 42, upload: 14 },
    { time: "14:00", download: 70, upload: 22 },
    { time: "15:00", download: 61, upload: 19 },
    { time: "16:00", download: 84, upload: 26 }
];

export const securityChecks = [
    { id: 1, title: "Use WPA2 or WPA3 encryption", description: "Use modern Wi-Fi encryption.", status: "pass" },
    { id: 2, title: "Change default router credentials", description: "Avoid factory-default administrator passwords.", status: "warning" },
    { id: 3, title: "Review connected devices", description: "Check for unfamiliar devices regularly.", status: "warning" },
    { id: 4, title: "Update router firmware", description: "Install security updates from your router vendor.", status: "pass" },
    { id: 5, title: "Disable WPS if unnecessary", description: "Reduce exposure from legacy pairing features.", status: "warning" },
    { id: 6, title: "Use a guest network for visitors", description: "Separate guest devices from trusted devices.", status: "pass" }
];
