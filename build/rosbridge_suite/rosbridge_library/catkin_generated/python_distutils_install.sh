#!/bin/sh

if [ -n "$DESTDIR" ] ; then
    case $DESTDIR in
        /*) # ok
            ;;
        *)
            /bin/echo "DESTDIR argument must be absolute... "
            /bin/echo "otherwise python's distutils will bork things."
            exit 1
    esac
fi

echo_and_run() { echo "+ $@" ; "$@" ; }

echo_and_run cd "/home/yann/catkin_ws/src/rosbridge_suite/rosbridge_library"

# ensure that Python install destination exists
echo_and_run mkdir -p "$DESTDIR/home/yann/catkin_ws/install/lib/python2.7/dist-packages"

# Note that PYTHONPATH is pulled from the environment to support installing
# into one location when some dependencies were installed in another
# location, #123.
echo_and_run /usr/bin/env \
    PYTHONPATH="/home/yann/catkin_ws/install/lib/python2.7/dist-packages:/home/yann/catkin_ws/build/lib/python2.7/dist-packages:$PYTHONPATH" \
    CATKIN_BINARY_DIR="/home/yann/catkin_ws/build" \
    "/usr/bin/python2" \
    "/home/yann/catkin_ws/src/rosbridge_suite/rosbridge_library/setup.py" \
    egg_info --egg-base /home/yann/catkin_ws/build/rosbridge_suite/rosbridge_library \
    build --build-base "/home/yann/catkin_ws/build/rosbridge_suite/rosbridge_library" \
    install \
    --root="${DESTDIR-/}" \
    --install-layout=deb --prefix="/home/yann/catkin_ws/install" --install-scripts="/home/yann/catkin_ws/install/bin"
