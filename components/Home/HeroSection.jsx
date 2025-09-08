"use client"

import Link from "next/link";
import { BiRightArrowAlt } from "react-icons/bi";
import Button from "../Form/Button";
import HeroSectionTab from "./HeroSectionTab";
import { useContext } from "react";
import { contextProvider } from "@/contexts/Context";
import { motion } from "framer-motion";

function HeroSection() {
    const {walletAddress, connectWallet} = useContext(contextProvider)
    
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0.3,
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return ( 
        <motion.div
            className="container grid lg:grid-cols-2 gap-x-[200px] py-[40px] lg:py-[80px]"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="mb-10 lg:mb-0">
                <motion.h2 className="text-3xl md:text-[60px] lg:text-[80px] text-primary-200 font-bold" variants={itemVariants}>282,943,170</motion.h2>
                <motion.h3 className="text-3xl md:text-[60px] xl:text-[80px] text-black uppercase font-bold leading-[80px] mb-2 lg:mb-8 dark:text-white" variants={itemVariants}>Users <br className="hidden lg:block" />Trust Us</motion.h3>
                
                {walletAddress === "" && <motion.div variants={itemVariants}>
                    <Button
                        handleFunc={connectWallet}
                        text="Connect"
                        className={"px-14"}
                    />
                </motion.div>}
            </div>

            <div>
                <motion.div variants={itemVariants}>
                    <HeroSectionTab/>
                </motion.div>
                <motion.button variants={itemVariants}>
                    <Link href="/markets" className="text-black dark:text-white flex items-center gap-x-2 mt-10 hover:text-primary-100 duration-300">
                    View all Coins <BiRightArrowAlt/>
                    </Link>
                </motion.button>
            </div>
        </motion.div>
    );
}

export default HeroSection;