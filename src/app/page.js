import Image from 'next/image'
import styles from './page.module.css'
import SeaportIntegration from './seaport'
import NFTApi from './NFTApi'
import FactoryContract from './FactoryContract'

export default function Home() {
  return (
    <main className={styles.main}>
      <div>
        {/* <SeaportIntegration /> */}
        {/* <NFTApi /> */}
        <br />
        <FactoryContract />
      </div>
    </main>
  )
}
