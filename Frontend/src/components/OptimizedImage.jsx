import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';

/**
 * OptimizedImage — handles skeletons, fade-in, lazy loading, and cache-hit onLoad issues.
 */
const OptimizedImage = ({
    src,
    alt = '',
    className = '',
    containerClassName = '',
    width,
    height,
    eager = false,
    style = {},
    onClick,
    ...rest
}) => {
    const [loaded, setLoaded] = useState(false);
    const [inView, setInView] = useState(eager);
    const containerRef = useRef(null);
    const lastSrc = useRef(src);

    // 1. Reset state synchronously when src changes
    // This avoids the race condition where useEffect runs after onLoad
    if (lastSrc.current !== src) {
        setLoaded(false);
        lastSrc.current = src;
    }

    // 2. Intersection Observer for Lazy Loading
    useLayoutEffect(() => {
        if (eager) {
            setInView(true);
            return;
        }

        const currentContainer = containerRef.current;
        if (!currentContainer) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    observer.disconnect();
                }
            },
            { 
                rootMargin: '400px', // More aggressive margin for smoother feel
                threshold: 0
            }
        );

        observer.observe(currentContainer);
        return () => observer.disconnect();
    }, [eager, src]);

    // 3. Callback ref to handle cached images instantly
    const handleImageRef = (img) => {
        if (img && img.complete && !loaded) {
            setLoaded(true);
        }
    };

    return (
        <div
            ref={containerRef}
            className={`relative overflow-hidden ${containerClassName}`}
            style={{ width, height, ...style }}
            onClick={onClick}
        >
            {/* Skeleton Pulse */}
            {!loaded && (
                <div
                    className="absolute inset-0 bg-gray-200 animate-pulse rounded"
                    style={{ zIndex: 1 }}
                />
            )}

            {/* Actual Image */}
            {inView && (
                <img
                    ref={handleImageRef}
                    src={src}
                    alt={alt}
                    loading={eager ? 'eager' : 'lazy'}
                    decoding="async"
                    onLoad={() => setLoaded(true)}
                    onError={() => setLoaded(true)} // Prevent stuck skeleton on 404
                    className={`transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'} ${className}`}
                    style={{ width: '100%', height: '100%', ...rest.style }}
                    {...rest}
                />
            )}
        </div>
    );
};

export default OptimizedImage;
