"use client";

import { gsap } from "gsap";
import { Observer } from "gsap/Observer";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Registered once here so no component imports `gsap` plugins directly.
gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin, Observer);

export { gsap, Observer, ScrollTrigger, useGSAP };
