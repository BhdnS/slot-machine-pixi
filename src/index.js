import './index.scss';
import {SlotMachine} from './module/SlotMashine.js'

(async () => {
  const slotMachine = new SlotMachine()
  await slotMachine.init()
})()