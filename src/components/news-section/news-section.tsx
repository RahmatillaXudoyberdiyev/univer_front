'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import placeholderImage from '../../../public/image.png'
import { Button } from '../ui/button'

const NewsSection = () => {
    return (
        <div className="container-cs py-5 mb-5">
            <div>
                <div className="flex justify-between items-center pb-5">
                    <h1 className="font-bold text-2xl mb-6 pb-2 border-b-2 border-[#2B2B7A] w-fit ">
                        Yangiliklar
                    </h1>
                    <Button variant="ghost" asChild>
                        <Link href="">Barcha Yangiliklar</Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                        <Image src={placeholderImage} alt="" />
                    </div>
                    {Array.from({ length: 6 }).map((_, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-100px' }}
                            transition={{
                                duration: 0.5,
                                delay: index * 0.1,
                                type: 'spring',
                                stiffness: 300,
                            }}
                            className="flex flex-col"
                            whileHover={{ scale: 1.02 }}
                        >
                            <div>
                                <Link href="">
                                    <Image
                                        src={placeholderImage}
                                        alt=""
                                        className="mb-3"
                                    />
                                </Link>
                                <p className=" pt-2 text-[#76767A]">
                                    18.11.2025, 11:38
                                </p>
                                <Link href="">
                                    <h1 className="font-bold ">
                                        Today marks 34 years since the adoption
                                        of the Law..
                                    </h1>
                                </Link>

                                <p className=" pt-2">
                                    Our State Flag is a symbol of our national
                                    identity and one of the main emblems that
                                    represents the name ...
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default NewsSection
