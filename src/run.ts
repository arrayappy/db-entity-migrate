import { migrate } from "."
import { config } from './config'

migrate(config)
  .then(() => console.log('Successfully completed.'))
  .catch((e) => console.error(e))