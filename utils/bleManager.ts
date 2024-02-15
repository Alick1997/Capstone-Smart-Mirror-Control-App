import { BleError, BleManager, Device, DeviceId } from "react-native-ble-plx";
import { Platform, PermissionsAndroid } from "react-native";

export const MIRROR_DATA_SERVICE_ID = ""
export const MIRROR_AUTH_SERVICE_ID = ""
const MIRROR_CALENDAR_CHARACTERISTIC_ID = ""
const MIRROR_TODO_CHARACTERISTIC_ID = ""
const MIRROR_AUTH_TOKEN_CHARACTERISTIC_ID = ""

export const manager = new BleManager()

export async function getDevices(identifiers: string[]): Promise<Device[]> {
    try {
        return await manager.devices(identifiers)
    } catch (e) {
        console.log(e)
        return []
    }
}

export function scanAvailableMirrors(callback: (dev: Device) => void, errorCallback: (e: BleError) => void) {

    manager.startDeviceScan(null, null, async (e, dev) => {
        if(e) {
            errorCallback(e)
        }
        if(dev) {
            callback(dev)
        }
        
    })
}

export async function attemptConnectToMirror(devId: DeviceId): Promise<Device> {
    let servicesFound =0
    const device = await manager.connectToDevice(devId)
    await device.discoverAllServicesAndCharacteristics()

    device.serviceUUIDs?.forEach(service=> {
        if(service === MIRROR_AUTH_SERVICE_ID || service === MIRROR_DATA_SERVICE_ID) {
            servicesFound++
        }
    })

    if(servicesFound < 2)
        throw new Error("Device has invalid bluetooth services.")

    return device
}

export async function writeCalendarDataToMirror(data: string, device: Device) {
    await device.writeCharacteristicWithoutResponseForService(
        MIRROR_CALENDAR_CHARACTERISTIC_ID,
        MIRROR_CALENDAR_CHARACTERISTIC_ID,
        Buffer.from(data).toString("base64")
    )
}

export async function writeAuthTokenToMirror(token: string, device: Device) {
    await device.writeCharacteristicWithoutResponseForService(
        MIRROR_AUTH_SERVICE_ID,
        MIRROR_AUTH_TOKEN_CHARACTERISTIC_ID,
        Buffer.from(token).toString("base64")
    )
}

export async function requestAllPermissionsForBle(): Promise<boolean> {
        if (Platform.OS === 'ios') {
          return true
        }
        if (Platform.OS === 'android' && PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION) {
          const apiLevel = parseInt(Platform.Version.toString(), 10)
      
          if (apiLevel < 31) {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
            return granted === PermissionsAndroid.RESULTS.GRANTED
          }
          if (PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN && PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT) {
            const result = await PermissionsAndroid.requestMultiple([
              PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
              PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            ])
      
            return (
              result['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED &&
              result['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
              result['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED
            )
          }
        }
      
        alert('Permission have not been granted')
      
        return false
}