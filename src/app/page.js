'use client';
import Image from 'next/image'
import styles from './page.module.css'
import SeaportIntegration from './seaport'
import NFTApi from './NFTApi'
import FactoryContract from './FactoryContract'
import Lighthouse from './Lighthouse'

export default function Home() {
  return (
    <main className={styles.main}>
      <div>
        {/* <SeaportIntegration /> */}
        {/* <NFTApi /> */}
        <br />
        <FactoryContract />
        <br />
        <Lighthouse />
      </div>
    </main>
  )
}
