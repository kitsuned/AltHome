clean:
	cargo clean

build-armhf:
	cargo build --release --target armv7-unknown-linux-gnueabihf

patchelf: build-armhf
	patchelf --set-interpreter /lib/ld-linux.so.3\
		--replace-needed ld-linux-armhf.so.3 ld-linux.so.3 \
		./target/armv7-unknown-linux-gnueabihf/release/althome_agentd

move: patchelf
	cp -R ./target/armv7-unknown-linux-gnueabihf/release/althome_agentd agentd-armhf-release

pack: move
	upx agentd-armhf-release

all: pack
